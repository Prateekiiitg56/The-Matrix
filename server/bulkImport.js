const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/Problem');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';
const LEETCODE_ALL_API = 'https://leetcode.com/api/problems/algorithms/';

const QUESTION_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      isPaidOnly
      difficulty
      topicTags {
        name
      }
      codeSnippets {
        langSlug
        code
      }
      exampleTestcases
    }
  }
`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchLeetCodeQuestion(titleSlug) {
    try {
        const response = await fetch(LEETCODE_GRAPHQL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: QUESTION_QUERY, variables: { titleSlug } }),
        });

        const body = await response.json();
        if (body.errors) return null;
        return body.data.question;
    } catch (error) {
        return null;
    }
}

function processProblemData(lcData) {
    if (!lcData || lcData.isPaidOnly || !lcData.content) return null;

    const tags = lcData.topicTags.map(t => t.name);
    const boilerplates = {};

    if (lcData.codeSnippets) {
        const py = lcData.codeSnippets.find(s => s.langSlug === 'python3' || s.langSlug === 'python');
        const j = lcData.codeSnippets.find(s => s.langSlug === 'java');
        const c = lcData.codeSnippets.find(s => s.langSlug === 'cpp');
        boilerplates.python = py ? py.code : '';
        boilerplates.java = j ? j.code : '';
        boilerplates.cpp = c ? c.code : '';
    }

    let processedDescription = lcData.content
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\\n\\n')
        .replace(/<ul>/g, '')
        .replace(/<\/ul>/g, '')
        .replace(/<li>/g, '- ')
        .replace(/<\/li>/g, '\\n')
        .replace(/<pre>/g, '```text\\n')
        .replace(/<\/pre>/g, '\\n```\\n')
        .replace(/<code>/g, '\`')
        .replace(/<\/code>/g, '\`')
        .replace(/<strong>/g, '**')
        .replace(/<\/strong>/g, '**')
        .replace(/<em>/g, '*')
        .replace(/<\/em>/g, '*')
        .replace(/&nbsp;/g, ' ');

    const examplesArray = [];
    if (lcData.exampleTestcases) {
        const rawTestcases = lcData.exampleTestcases.split('\\n');
        let displayString = '';
        rawTestcases.forEach((val) => { if (val) displayString += val + ' | '; });
        examplesArray.push({
            input: displayString.slice(0, -3),
            output: 'Evaluate code to discover',
            explanation: 'Extracted automatically from LeetCode raw tests.'
        });
    }

    return new Problem({
        title: lcData.title,
        problemId: parseInt(lcData.questionFrontendId, 10),
        difficulty: lcData.difficulty,
        tags: tags,
        description: processedDescription,
        examples: examplesArray,
        constraints: ['Constraints intentionally hidden for core execution mode.'],
        boilerplates: boilerplates
    });
}

async function runBulkImport() {
    console.log('🌐 Fetching All LeetCode Algorithms metadata... This may take a moment.');

    let allSlugs = [];
    try {
        const res = await fetch(LEETCODE_ALL_API);
        const data = await res.json();

        // Filter only free questions, sorted by popularity roughly
        const freeQuestions = data.stat_status_pairs.filter(q => !q.paid_only);

        // Sort by Total Submitted to roughly approximate popularity
        freeQuestions.sort((a, b) => b.stat.total_submitted - a.stat.total_submitted);

        // Extract first 350 free question slugs
        allSlugs = freeQuestions.slice(0, 350).map(q => q.stat.question__title_slug);
        console.log(`✅ Safely extracted ${allSlugs.length} free question slugs! Initializing Database injection...`);
    } catch (e) {
        console.error('❌ Failed to fetch algorithms list:', e.message);
        process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB Matrix...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/latecode');
    console.log('✅ Connected!');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < allSlugs.length; i++) {
        const slug = allSlugs[i];
        process.stdout.write(`[${i + 1}/${allSlugs.length}] Hacking node [${slug}]... `);

        const lcData = await fetchLeetCodeQuestion(slug);
        const problemRecord = processProblemData(lcData);

        if (problemRecord) {
            try {
                await Problem.findOneAndDelete({ problemId: problemRecord.problemId });
                await problemRecord.save();
                process.stdout.write('🟢 SYNCED!\\n');
                successCount++;
            } catch (err) {
                process.stdout.write('🔴 DB ERROR\\n');
                failCount++;
            }
        } else {
            process.stdout.write('🔴 SKIPPED (Premium/Parse Error)\\n');
            failCount++;
        }

        // Massive crawler protection: wait 1500 milliseconds between API calls
        await delay(1500);
    }

    console.log('\\n==========================================');
    console.log(`🏆 BULK IMPORT COMPLETE!`);
    console.log(`✅ Successfully added: ${successCount} problems`);
    console.log(`❌ Skipped/Failed: ${failCount} problems`);
    console.log('==========================================');
    mongoose.connection.close();
}

runBulkImport();

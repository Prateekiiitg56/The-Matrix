const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/Problem');

// The GraphQL Query for LeetCode's public API
const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

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

async function fetchLeetCodeQuestion(titleSlug) {
    try {
        console.log(`📡 Hacking into LeetCode Mainframe for: [${titleSlug}]...`);
        const response = await fetch(LEETCODE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: QUESTION_QUERY,
                variables: { titleSlug },
            }),
        });

        const body = await response.json();
        if (body.errors) {
            throw new Error(body.errors[0].message);
        }
        return body.data.question;
    } catch (error) {
        console.error('🔴 Failed to download problem data from LeetCode:', error.message);
        process.exit(1);
    }
}

async function run() {
    const titleSlug = process.argv[2];
    if (!titleSlug) {
        console.error('❌ Usage: node importLeetcode.js <problem-slug>');
        console.error('💡 Example: node importLeetcode.js "longest-palindromic-substring"');
        process.exit(1);
    }

    // Fetch the data
    const lcData = await fetchLeetCodeQuestion(titleSlug);

    if (!lcData) {
        console.error(`❌ Problem '${titleSlug}' not found.`);
        process.exit(1);
    }

    if (lcData.isPaidOnly) {
        console.error(`🔐 Problem '${titleSlug}' is a Premium question. Access Denied.`);
        process.exit(1);
    }

    console.log(`✅ Data intercepted successfully: ${lcData.title} (${lcData.difficulty})`);

    // Format the raw data into our Mongoose schema
    const tags = lcData.topicTags.map(t => t.name);

    // We extract code snippets
    const boilerplates = {};
    if (lcData.codeSnippets) {
        const pythonSnippet = lcData.codeSnippets.find(s => s.langSlug === 'python3' || s.langSlug === 'python');
        const javaSnippet = lcData.codeSnippets.find(s => s.langSlug === 'java');
        const cppSnippet = lcData.codeSnippets.find(s => s.langSlug === 'cpp');

        boilerplates.python = pythonSnippet ? pythonSnippet.code : '';
        boilerplates.java = javaSnippet ? javaSnippet.code : '';
        boilerplates.cpp = cppSnippet ? cppSnippet.code : '';
    }

    // Convert HTML line breaks roughly to markdown spacing to keep ReactMarkdown happy
    let processedDescription = lcData.content || '';
    processedDescription = processedDescription
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

    // Generate blank examples directly from the test cases payload if available
    const examplesArray = [];
    if (lcData.exampleTestcases) {
        const rawTestcases = lcData.exampleTestcases.split('\\n');
        let displayString = '';
        rawTestcases.forEach((val, i) => {
            if (val) displayString += val + ' | ';
        });
        examplesArray.push({
            input: displayString.slice(0, -3), // Slice last ' | '
            output: 'Evaluate code to discover',
            explanation: 'Extracted automatically from LeetCode raw tests.'
        });
    }

    const newProblem = new Problem({
        title: lcData.title,
        problemId: parseInt(lcData.questionFrontendId, 10),
        difficulty: lcData.difficulty,
        tags: tags,
        description: processedDescription,
        examples: examplesArray,
        constraints: ['Constraints intentionally hidden for core execution mode.'],
        boilerplates: boilerplates
    });

    // Connect & Save
    try {
        console.log('🔌 Connecting to MongoDB Matrix...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/latecode');

        console.log(`💾 Injecting Document: [${newProblem.problemId}] ${newProblem.title}...`);
        // Delete if already exist
        await Problem.findOneAndDelete({ problemId: newProblem.problemId });
        await newProblem.save();

        console.log('🟢 IMPORT COMPLETE! Database Synchronized.');
    } catch (dbErr) {
        console.error('🔴 Database Injection Error:', dbErr.message);
    } finally {
        mongoose.connection.close();
    }
}

run();

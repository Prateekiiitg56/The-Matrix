const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/Problem');

const seedProblems = [
    {
        problemId: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.
You can return the answer in any order.`,
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
        ],
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.'
        ],
        boilerplates: {
            python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        `,
            java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`
        }
    },
    {
        problemId: 2,
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        tags: ['String', 'Stack'],
        description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        examples: [
            { input: 's = "()"', output: 'true', explanation: '' },
            { input: 's = "()[]{}"', output: 'true', explanation: '' },
            { input: 's = "(]"', output: 'false', explanation: '' }
        ],
        constraints: [
            '1 <= s.length <= 10^4',
            's consists of parentheses only \'()[]{}\''
        ],
        boilerplates: {
            python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        `,
            java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`
        }
    },
    {
        problemId: 3,
        title: 'Merge Intervals',
        difficulty: 'Medium',
        tags: ['Array', 'Sorting'],
        description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        examples: [
            { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
            { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
        ],
        constraints: [
            '1 <= intervals.length <= 10^4',
            'intervals[i].length == 2',
            '0 <= starti <= endi <= 10^4'
        ],
        boilerplates: {
            python: `class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        `,
            java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};`
        }
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/latecode')
    .then(async () => {
        console.log('🟢 MongoDB MATRIX connected');
        await Problem.deleteMany({}); // Clear existing before seeding
        console.log('🗑️  Cleared old problems database');

        await Problem.insertMany(seedProblems);
        console.log('✅ Successfully seeded core DSA problems into the Matrix');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('🔴 MongoDB connection error:', err);
        process.exit(1);
    });

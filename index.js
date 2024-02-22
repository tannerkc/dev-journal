#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

const journalFilePath = 'journal.json';
const configFilePath = 'config.json';

let config = {};
if (fs.existsSync(configFilePath)) {
    const data = fs.readFileSync(configFilePath, 'utf8');
    config = JSON.parse(data);
}

const log = console.log;

program
    .command('config')
    .description('Configure user settings')
    .action(() => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter your name:',
                validate: value => value.trim() !== '' ? true : 'Please enter your name.',
            },
            {
                type: 'input',
                name: 'color',
                message: 'What\'s your favorite colour? (hex value)',
                validate: value => /^#[0-9A-F]{6}$/i.test(value) ? true : 'Please enter a valid hex color value (e.g., #RRGGBB)',
            },
        ];

        inquirer.prompt(questions).then(answers => {
            config = answers;
            fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
            log(chalk.hex(config.color)('User settings saved successfully.'));
        });
    });

program
    .command('start')
    .description('Start a new journal entry')
    .action(async () => {
        const questions = [
            {
                type: 'number',
                name: 'mood',
                message: 'On a scale of 0-10, how is your mood?',
                validate: value => value >= 0 && value <= 10 ? true : 'Please enter a number between 0 and 10',
            },
            {
                type: 'number',
                name: 'dayRating',
                message: 'Rate your day overall (0-10):',
                validate: value => value >= 0 && value <= 10 ? true : 'Please enter a number between 0 and 10',
            },
            {
                type: 'number',
                name: 'productivity',
                message: 'How productive were you today (0-10)?',
                validate: value => value >= 0 && value <= 10 ? true : 'Please enter a number between 0 and 10',
            },
            {
                type: 'number',
                name: 'tasksCompleted',
                message: 'How many tasks did you complete today?',
            },
        ];

        const answers = await inquirer.prompt(questions);

        console.log('\nJournal prompts:');
        console.log('- What was the highlight of your day?');
        console.log('- What challenges did you face?');
        console.log('- What are you grateful for today?');
        console.log('- Any lessons learned?');

        inquirer.prompt({
            type: 'editor',
            name: 'journalEntry',
            message: 'Type your journal entry (press Enter to start):',
        }).then(entry => {
            const newEntry = {
                mood: answers.mood,
                dayRating: answers.dayRating,
                productivity: answers.productivity,
                tasksCompleted: answers.tasksCompleted,
                journalEntry: entry.journalEntry.trim(),
                dateTime: new Date().toISOString(),
            };

            saveEntry(newEntry);
        });
    });

program
    .command('list')
    .description('List all journal entries')
    .action(() => {
        const entries = loadEntries();
        if (entries.length === 0) {
            console.log('No entries found.');
        } else {
            entries.forEach((entry, index) => {
                console.log(`Entry ${index + 1}: ${entry.dateTime}`);
            });
        }
    });

program
    .command('view <index>')
    .description('View a specific journal entry')
    .action(index => {
        const entries = loadEntries();
        const entry = entries[index - 1];
        if (entry) {
            console.log(`Date/Time: ${entry.dateTime}`);
            console.log(`Mood: ${entry.mood}/10`);
            console.log(`Overall Day Rating: ${entry.dayRating}/10`);
            console.log(`Productivity: ${entry.productivity}/10`);
            console.log(`Tasks Completed: ${entry.tasksCompleted}`);
            console.log(`Journal Entry:\n${entry.journalEntry}`);
        } else {
            console.log('Entry not found.');
        }
    });

program.parse(process.argv);

function saveEntry(entry) {
    let entries = [];
    if (fs.existsSync(journalFilePath)) {
        const data = fs.readFileSync(journalFilePath, 'utf8');
        entries = JSON.parse(data);
    }
    entries.push(entry);
    fs.writeFileSync(journalFilePath, JSON.stringify(entries, null, 2));
    console.log('Entry saved successfully.');
}

function loadEntries() {
    if (fs.existsSync(journalFilePath)) {
        const data = fs.readFileSync(journalFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import babar from 'babar';
import fs from 'fs';
import {
    findSelectedEntry,
    listAvailableEditors,
    getAppropriateGreeting,
    getHexColor,
    loadEntries,
    saveEntry,
    log, config, configFilePath, openInVSCode, openInEditor, mostCommonValue, getAverage
} from "./utils.mjs";

const ui = new inquirer.ui.BottomBar();

process.env.EDITOR = 'nano';
process.env.VISUAL = config.selectedEditor;

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const { name, description, version } = packageJson;

program
    .name(name)
    .description(description)
    .version(version);

program
    .command('config')
    .alias('c')
    .description('Configure user settings')
    .action(async () => {
        try{
            ui.log.write(config.name ? `${getAppropriateGreeting()}, ${config.name}! Let's set your configurations:` : 'Hello! It\'s nice to meet you!')
            const questions = [
                {
                    type: 'input',
                    name: 'name',
                    message: 'What\'s your name?',
                    default: config.name || null,
                    validate: value => value.trim() !== '' ? true : 'Please enter your name.',
                },
                {
                    type: 'input',
                    name: 'color',
                    message: 'What\'s your favorite colour? (hex value)',
                    default: config.color || null,
                    validate: value => /^#[0-9A-F]{6}$/i.test(value) ? true : 'Please enter a valid hex color value (e.g., #RRGGBB)',
                },
                {
                    type: 'list',
                    name: 'selectedEditor',
                    message: 'Select an editor:',
                    default: listAvailableEditors().indexOf(process.env.VISUAL),
                    choices: listAvailableEditors(),
                    validate: selected => selected.length > 0 ? true : 'Please select at least one editor',
                }
            ];

            const newConfig = await inquirer.prompt(questions)

            process.env.VISUAL = newConfig.selectedEditor;

            fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));
            log.custom('User settings saved successfully.', newConfig.color)
        } catch (e) {
            log.red(e)
            process.exit(1);
        }
    });

program
    .command('write')
    .alias('w')
    .description('Start a new journal entry')
    .action(async () => {
        try {
            if (!config.name) {
                log.yellow('Please run the config command.');
                process.exit()
            }
            const entries = loadEntries()
            const moodValues = entries.map(entry => entry.mood);
            const dayRatingValues = entries.map(entry => entry.dayRating);
            const productivityValues = entries.map(entry => entry.productivity);

            const defaultMood = mostCommonValue(moodValues);
            const defaultDayRating = mostCommonValue(dayRatingValues);
            const defaultProductivity = mostCommonValue(productivityValues);

            const questions = [
                {
                    type: 'number',
                    name: 'mood',
                    message: 'On a scale of 0-10, how is your mood?',
                    default: defaultMood || null,
                    validate: value => value >= 0 && value <= 10 ? true : 'Please enter a number between 0 and 10',
                },
                {
                    type: 'number',
                    name: 'dayRating',
                    message: 'Rate your day overall (0-10):',
                    default: defaultDayRating || null,
                    validate: value => value >= 0 && value <= 10 ? true : 'Please enter a number between 0 and 10',
                },
                {
                    type: 'number',
                    name: 'productivity',
                    message: 'How productive were you today (0-10)?',
                    default: defaultProductivity || null,
                    validate: value => value >= 0 && value <= 10 ? true : 'Please enter a number between 0 and 10',
                },
                {
                    type: 'number',
                    name: 'tasksCompleted',
                    message: 'How many tasks did you complete today?',
                },
            ];
            ui.log.write(`${getAppropriateGreeting()}, ${config.name}!`)

            const answers = await inquirer.prompt(questions);
            const promptSelection = await inquirer.prompt({
                type: 'list',
                name: 'selectedPrompt',
                message: 'Select journal a prompt (use Enter to select)',
                choices: [
                    'Freestyle',
                    'What was the highlight of your day?',
                    'What challenges did you face?',
                    'What are you grateful for today?',
                    'Any lessons learned?',
                ],
                validate: selected => selected.length > 0 ? true : 'Please select a prompt',
            });
            const currentDate = new Date();
            const newEntry = {
                mood: parseInt(answers.mood, 10),
                dayRating: parseInt(answers.dayRating, 10),
                productivity: parseInt(answers.productivity, 10),
                tasksCompleted: parseInt(answers.tasksCompleted, 10),
                journalPrompt: promptSelection.selectedPrompt,
                date: currentDate.toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
                time: currentDate.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, // Use 24-hour format
                }),
                dateTime: currentDate,
            };

            let journalEntry;
            const terminalEditors = ['vim', 'nano', 'emacs', 'ed', 'joe', 'jed', 'tilde', 'ne', 'micro']
            if (!terminalEditors.includes(config.selectedEditor)) {
                const entryConfirmation = await inquirer.prompt({
                    type: 'confirm',
                    name: 'decision',
                    message: 'Type your journal entry (press Enter to start):',
                })
                if(!entryConfirmation.decision) process.exit(0)
                journalEntry = await openInEditor(config.selectedEditor)
            } else {
                const entry = await inquirer.prompt({
                    type: 'editor',
                    name: 'journalEntry',
                    message: 'Type your journal entry (press Enter to start):',
                })
                journalEntry = entry.journalEntry
            }

            newEntry.journalEntry = journalEntry.trim();
            saveEntry(newEntry);
        } catch (e) {
            log.red(e)
        }
    });

program
    .command('list')
    .alias('l')
    .description('List all journal entries')
    .action(() => {
        const entries = loadEntries();
        if (entries.length === 0) {
            log.red('No entries found.');
            process.exit(0);
        } else {
            entries.forEach((entry, index) => {
                log.yellow(`Entry ${index + 1}: ${entry.date} ${entry.time}`);
            });
            process.exit(0);
        }
    });

program
    .command('view <date> [timeOrIndex]')
    .alias('v')
    .description('View a specific journal entry by index or date')
    .action(async (date, timeOrIndex) => {
        const entries = loadEntries();
        const entry = await findSelectedEntry(date, timeOrIndex, entries);

        if (entry) {
            const moodColor = chalk.hex(getHexColor(entry.mood));
            const dayRatingColor = chalk.hex(getHexColor(entry.dayRating));
            const productivityColor = chalk.hex(getHexColor(entry.productivity));

            const entryDetails = `Mood: ${moodColor(`${entry.mood}/10`)} | Overall Day Rating: ${dayRatingColor(`${entry.dayRating}/10`)} | Productivity: ${productivityColor(`${entry.productivity}/10`)} | Tasks Completed: ${entry.tasksCompleted}`;

            const box = boxen(
                entryDetails +
                '\n\n' + entry.journalPrompt +
                '\n\n' + entry.journalEntry,
                { title: `${entry.date} ${entry.time}`, titleAlignment: 'center', borderColor: config.color, padding: 1}
            )

            log.default(box);
            process.exit()
        } else {
            log.red('Entry not found.');
            process.exit()
        }
    });

program
    .command('insights')
    .alias('i')
    .description('View insights on journal entries')
    .action(() => {
        const entries = loadEntries();

        if (entries.length === 0) {
            log.red('No entries found.');
            process.exit(0);
        }

        if (entries.length !== 1) {
            const moodData = entries.map(entry => [new Date(entry.dateTime).getTime(), entry.mood]);
            const productivityData = entries.map(entry => [new Date(entry.dateTime).getTime(), entry.productivity]);
            const moodGraph = babar(moodData, { title: 'Mood over Time', maxY: 10 });
            const productivityGraph = babar(productivityData, { title: 'Productivity over Time', maxY: 10 });

            log.default('Mood over Time:');
            log.default(moodGraph);

            log.default('\nProductivity over Time:');
            log.default(productivityGraph);
        } else {
            log.yellow('As you write more entries, you\'ll start to see charts here for your mood and productivity' +
                ' over time.');
        }


        const moodValues = entries.map(entry => entry.mood);
        const dayRatingValues = entries.map(entry => entry.dayRating);
        const productivityValues = entries.map(entry => entry.productivity);

        const moodAverage = getAverage(moodValues);
        const dayRatingAverage = getAverage(dayRatingValues);
        const productivityAverage = getAverage(productivityValues);

        const moodColor = getHexColor(moodAverage)
        const dayRatingColor = getHexColor(dayRatingAverage)
        const productivityColor = getHexColor(productivityAverage)

        log.default('Insights:')
        log.custom(`Average Mood: ${moodAverage.toFixed(2)}/10`, moodColor)
        log.custom(`Average Day Rating: ${dayRatingAverage.toFixed(2)}/10`, dayRatingColor)
        log.custom(`Average Productivity: ${productivityAverage.toFixed(2)}/10`, productivityColor)

        process.exit()
    });


program.parse(process.argv);

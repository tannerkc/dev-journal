#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import * as prompts from '@clack/prompts'
import chalk from 'chalk';
import boxen from 'boxen';
import babar from 'babar';
import { setTimeout } from 'node:timers/promises'
import fs from 'fs';
import {
    findSelectedEntry,
    listAvailableEditors,
    getAppropriateGreeting,
    getHexColor,
    loadEntries,
    saveEntry,
    log, config, configFilePath, openInVSCode, openInEditor, mostCommonValue, getAverage, getAppropriateTime
} from "./utils.mjs";

try {
    process.env.EDITOR = 'nano';
    process.env.VISUAL = config.selectedEditor;

    // const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    // const { name, description, version } = packageJson;

    const psuedoLoad = async (time = 1000) => {
        const s = prompts.spinner()
        s.start()
        await setTimeout(time)
        s.stop()
    }

    // program
    //     .name(name)
    //     .description(description)
    //     .version(version);

    program
        .command('config')
        .alias('c')
        .description('Configure user settings')
        .action(async () => {
            try{
                prompts.intro(config.name ? `${getAppropriateGreeting()}, ${config.name}! Let's set your configurations:` : 'Hello! It\'s nice to meet you!')
                const newConfig = await prompts.group(
                    {
                        name: () => prompts.text(
                            { message: 'What is your name?',
                                initialValue: config.name ? config.name : undefined,
                            validate(value) {
                                if (value.length === 0) return `Please enter your name.`;
                            }
                        }),
                        color: () => prompts.text(
                            { message: `What is your favorite ${chalk.hex(config.color || '#BCBEC3')('colour')}?`,
                                initialValue: config.color ? config.color : undefined,
                                placeholder: '(hex' +
                                    ' value)',
                                validate(value) {
                                    if (!/^#[0-9A-F]{6}$/i.test(value)) return 'Please enter a valid hex color value (e.g., #RRGGBB)'
                                }
                            }),
                        selectedEditor: ({ results }) =>
                        prompts.select({
                            message: `Set your preferred editor:`,
                            options: listAvailableEditors(),
                        }),
                    },
                    {
                        onCancel: ({ results }) => {
                            prompts.cancel('We\'ll keep everything the same.');
                            process.exit(0);
                        },
                    }
                )

                process.env.VISUAL = newConfig.selectedEditor;
                await psuedoLoad()
                fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));

                let nextSteps = `Run dev-journal write to create an entry.`;

                prompts.note(nextSteps,chalk.hex(newConfig.color)('Settings saved successfully.'));
                prompts.outro('Suggestions? ' + chalk.hex(newConfig.color)('https://github.com/tannerkc/dev-journal'))
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

                prompts.intro(`${getAppropriateGreeting()}, ${config.name}!`)

                const answers = await prompts.group(
                    {
                        mood: () => prompts.text({
                            message: 'On a scale of 0-10, how is your mood?',
                            initialValue: defaultMood || null,
                            validate(value) {
                                value = parseInt(value, 10)
                                if (value.length === 0) return 'Please enter a number between 0 and 10';
                                if (value < 0 || value > 10) return 'Please enter a number between 0 and 10';
                            }
                        }),
                        dayRating: () => prompts.text({
                            message: 'Rate your day overall (0-10):',
                            initialValue: defaultDayRating || null,
                            validate(value) {
                                value = parseInt(value, 10)
                                if (value.length === 0) return 'Please enter a number between 0 and 10';
                                if (value < 0 || value > 10) return 'Please enter a number between 0 and 10';
                            }
                        }),
                        productivity: () => prompts.text({
                            message: 'How productive were you today (0-10)?',
                            initialValue: defaultProductivity || null,
                            validate(value) {
                                value = parseInt(value, 10)
                                if (value.length === 0) return 'Please enter a number between 0 and 10';
                                if (value < 0 || value > 10) return 'Please enter a number between 0 and 10';
                            }
                        }),
                        tasksCompleted: () => prompts.text({
                            message: 'How many tasks did you complete today?',
                        })
                    },
                    {
                        onCancel: ({ results }) => {
                            prompts.cancel(`We'll finish this later. Have a great ${getAppropriateTime()}!`);
                            process.exit(0);
                        },
                    }
                );

                await psuedoLoad()

                const promptSelection = await prompts.select({
                    message: 'Select journal a prompt:',
                    options: [
                        {value: 'Freestyle', label: 'Freestyle'},
                        {value: 'What was the highlight of your day?', label: 'What was the highlight of your day?'},
                        {value: 'What challenges did you face?', label: 'What challenges did you face?'},
                        {value: 'What are you grateful for today?', label: 'What are you grateful for today?'},
                        {value: 'What lessons did you learn today?', label: 'What lessons did you learn today?'},
                    ],
                });
                const currentDate = new Date();
                const newEntry = {
                    mood: parseInt(answers.mood, 10) || 0,
                    dayRating: parseInt(answers.dayRating, 10) || 0,
                    productivity: parseInt(answers.productivity, 10) || 0,
                    tasksCompleted: parseInt(answers.tasksCompleted, 10) || 0,
                    journalPrompt: promptSelection,
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
                    const entryConfirmation = await prompts.confirm({
                        message: 'Write your journal entry (press Enter to start):',
                    });
                    if(!entryConfirmation) process.exit(0)
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

                await psuedoLoad()
                let nextSteps = `Run dev-journal list to see your entries. \nRun dev-journal view [date] to view a specific entry. \nHave a great ${getAppropriateTime()}!`;

                prompts.note(nextSteps,chalk.hex(config.color)('Journal entry saved successfully.'));
                prompts.outro('Suggestions? ' + chalk.hex(config.color)('https://github.com/tannerkc/dev-journal'))
            } catch (e) {
                log.red(e)
            }
        });

    program
        .command('list')
        .alias('l')
        .description('List all journal entries')
        .action(() => {
            // TODO create a select list and use prompts.note to show a selected entry
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
} catch (e) {
    log.red(e)
}

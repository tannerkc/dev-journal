import chalk from "chalk";
import {execSync} from "child_process";
import inquirer from "inquirer";
import fs from "fs";

export const journalFilePath = 'journal.json';
export const configFilePath = 'config.json';
export let config = {};
if (fs.existsSync(configFilePath)) {
    const data = fs.readFileSync(configFilePath, 'utf8');
    config = JSON.parse(data);
}
export const log = {
    red: (text) => console.log(chalk.red(text)),
    green: (text) => console.log(chalk.green(text)),
    yellow: (text) => console.log(chalk.yellow(text)),
    blue: (text) => console.log(chalk.blue(text)),
    magenta: (text) => console.log(chalk.magenta(text)),
    cyan: (text) => console.log(chalk.cyan(text)),
    favoriteColor: (text) => console.log(chalk.hex(config.color)(text)),
    custom: (text, hexColor) => console.log(chalk.hex(hexColor)(text)),
    default: console.log
};
export function getHexColor(value) {
    if (value >= 5) {
        // Yellow to green gradient
        const red = Math.floor(255 - (255 * (value - 5) / 5)).toString(16).padStart(2, '0');
        return `#${red}ff00`;
    } else {
        // Red to yellow gradient
        const green = Math.floor(255 * value / 5).toString(16).padStart(2, '0');
        return `#ff${green}00`;
    }
}

export function getColor(value) {
    if (value === 5) {
        return chalk.yellow; // Yellow for 5
    } else if (value > 5) {
        const intensity = 150 + (value - 5) * 10; // Adjust intensity for values > 5
        return chalk.rgb(255, intensity, 0); // Yellow to green gradient
    } else {
        const intensity = 255 - (5 - value) * 25; // Adjust intensity for values < 5
        return chalk.rgb(255, intensity, 0); // Yellow to red gradient
    }
}

export function getAppropriateGreeting() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        return 'Good afternoon';
    } else if (currentHour >= 18 && currentHour < 22) {
        return 'Good evening';
    } else {
        return "Woah! It's late";
    }
}
export function listAvailableEditors() {
    let editors = [];
    try {
        // Execute system command to list available editors
        const output = execSync('command -v vim nano code emacs subl atom notepad++ notepad gedit geany').toString();
        // Split the output by newlines to get individual editor paths
        editors = output.trim().split('\n');
    } catch (error) {
        console.error('Error listing editors:', error.message);
    }
    return editors;
}

export async function findSelectedEntry(date, timeOrIndex, entries) {
    const dateEntries = entries.filter(entry => entry.date.startsWith(date));

    if (dateEntries.length === 0) {
        return null; // No entries found for the specified date
    }

    let selectedEntry;
    if (timeOrIndex && /^\d+$/.test(timeOrIndex)) {
        // If a numeric index is provided, use it to select the entry
        const index = parseInt(timeOrIndex);
        selectedEntry = dateEntries[index];
    } else if (timeOrIndex) {
        // If a time is provided, find the entry with the matching time
        selectedEntry = dateEntries.find(entry => entry.time === timeOrIndex);
    } else if (dateEntries.length === 1) {
        // If there's only one entry for the date, select it automatically
        selectedEntry = dateEntries[0];
    } else {
        // Prompt the user to select an entry from the date
        const entryChoices = dateEntries.map(entry => ({
            name: `${entry.time}: ${entry.journalEntry.substring(0, 30)}...`,
            value: entry,
        }));
        const { selectedEntry: chosenEntry } = await inquirer.prompt({
            type: 'list',
            name: 'selectedEntry',
            message: 'Select an entry:',
            choices: entryChoices,
        });
        selectedEntry = chosenEntry;
    }

    return selectedEntry;
}
export function openInVSCode(text) {
    // Generate a temporary file name
    const tempFileName = 'temp-cli-input.txt';

    // Write the text to the temporary file
    fs.writeFileSync(tempFileName, text);

    // Open the file in Visual Studio Code
    execSync(`code ${tempFileName}`, { stdio: 'inherit' });

    // Read the contents of the file after the user has finished editing
    const editedText = fs.readFileSync(tempFileName, 'utf8');

    // Delete the temporary file
    fs.unlinkSync(tempFileName);

    return editedText;
}

export function saveEntry(entry) {
    let entries = [];
    if (fs.existsSync(journalFilePath)) {
        const data = fs.readFileSync(journalFilePath, 'utf8');
        entries = JSON.parse(data);
    }
    entries.push(entry);
    fs.writeFileSync(journalFilePath, JSON.stringify(entries, null, 2));
    log.favoriteColor('Entry saved successfully.');
}

export function loadEntries() {
    if (fs.existsSync(journalFilePath)) {
        const data = fs.readFileSync(journalFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

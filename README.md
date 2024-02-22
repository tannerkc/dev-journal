# Dev Journal CLI


A command-line interface (CLI) tool for journaling, built with Node.js. Keep track of your daily thoughts, moods, and productivity seamlessly from your terminal.

## Features

- Start a new journal entry
- View past entries with detailed information
- Choose from various text editors for entry creation
- Automatic mood, day rating, and productivity level calculation
- Configurable user settings for a personalized experience

## Installation

To install `dev-journal` globally, run:

```bash
npm install -g dev-journal
```
```bash
yarn global add dev-journal
```

## Usage
### Configuring User Settings

```bash
dev-journal config
```

Configure your user settings, including your name, favorite color, and preferred text editor.

### Starting a New Entry

```bash
dev-journal write
```

This command prompts you to answer a series of questions about your mood, day rating, productivity, and tasks completed. Afterward, you'll be prompted to write your journal entry in your preferred text editor.

### Viewing Past Entries

```bash
dev-journal view <date> [indexOrTime]
```

View a specific journal entry by providing the date it was created. If there are multiple entries for a date, they will be listed for you to select from. You can also specify an optional time parameter to view entries from a specific time of day.

### Viewing stats

```bash
dev-journal insights
```

Shows your average mood, day rating and productivity.

## Contributing

Contributions are welcome! Please read our [Contribution Guidelines](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - A powerful CLI tool for Node.js
- [chalk](https://github.com/chalk/chalk) - Terminal string styling done right
- [boxen](https://github.com/sindresorhus/boxen) - Create boxes in the terminal

## Support

If you encounter any issues or have questions or suggestions, please [open an issue](https://github.com/yourusername/dev-journal-cli/issues) on GitHub.

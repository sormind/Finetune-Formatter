# Fine-tune Data Formatter

## Overview
The Fine-tune Data Formatter is a React application designed to generate synthetic data based on user prompts and AI responses. It utilizes the Anthropic API to generate new, similar but distinct user prompts and AI responses.

## Features
- Input system prompt and entries.
- Generate a specified number of synthetic data points.
- Display formatted synthetic data.
- Export generated data to JSON.

## Setup and Installation
### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Vite
- A valid Anthropic API key

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/fine-tune-data-formatter.git
    cd fine-tune-data-formatter
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Anthropic API key:
    ```env
    VITE_ANTHROPIC_API_KEY=your-api-key-here
    ```

4. Run the application:
    ```bash
    npm run dev
    ```

## Usage
1. Navigate to `http://localhost:5173` in your browser.
2. Enter the number of synthetic data points you want to generate.
3. Click on "Generate Synthetic Data".
4. View the progress and generated data.
5. Export the data to JSON if needed.

## Development
### Mocking the API
For testing purposes, you can use a mock function to simulate the API response.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# BRIEF-Mobile-App-API
![MockUp](https://github.com/Michael-Elrod-dev/AI-Drone-Pollinator/blob/main/MockUp.png)

The BRIEF API is a serverless application designed for both an admin portal and a mobile application. It provides a set of endpoints to interact with the underlying data models like courses, assignments, and attempts.

## Tech Stack
- **Backend**: AWS Lambda, API Gateway
- **Database**: AWS DynamoDB
- **Framework**: AWS Serverless Application Model (SAM)
- **Language**: TypeScript

## Directory Structure

- `handlers/`: Prepares the payload and checks the authorization for each of the API endpoints.
- `models/`: Contains the data models and the logic for each of the API endpoints.
- `tests/`: Contains the unit and integration tests.
- `template.yaml`: The SAM template for deploying the API.

## Local Development and Testing

1. **Setup**: Make sure you have AWS SAM and Node.js installed.
2. **Install Dependencies**: Navigate to the project directory and run:
    ```bash
    npm install
    ```

3. **Run Locally**:
   For Admin Portal:
    ```bash
    npm run build-admin
    sam local start-api
    ```

   For Mobile Application:
    ```bash
    npm run build-mobile
    sam local start-api
    ```

4. **Testing with Postman**: Once the API is running locally, you can use Postman to send requests to `http://127.0.0.1:3000/` followed by the desired endpoint path. Use the provided Postman collection to test various endpoints.

## Deployment

To deploy the BRIEF API to AWS:

1. **Build**: Navigate to the project directory and run:
    ```bash
    npm run build
    ```

2. **Deploy with SAM**:
    ```bash
    sam deploy --guided
    ```

## Endpoints

The BRIEF API provides a set of CRUD (Create, Read, Update, Delete) operations for courses, assignments, and attempts. Check the `template.yaml` file for a list of available endpoints and their paths.
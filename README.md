# HubSpot Company Associations Card Extension

A HubSpot UI extension that allows users to manage company associations for contacts directly from the contact record page.

## Features

- View all associated companies for a contact
- Add or remove company associations

## Setup

1. Clone this repository
2. Install dependencies:

   ```bash
   yarn
   ```

3. Configure your HubSpot project:

   - Update the `API_BASE_URL` in `src/app/extensions/CompanyAssociationsCard.tsx` with your backend API URL

4. Upload the project to HubSpot:

   ```bash
   make upload
   ```

5. Start the development server:
   ```bash
   make dev
   ```

## Development

The project uses the following technologies:

- React with TypeScript
- HubSpot UI Extensions SDK
- HubSpot Developer Tools

### Available Commands

- `make upload` - Upload the project to HubSpot
- `make dev` - Start the development server

## Project Structure

```
src/
  app/
    extensions/
      CompanyAssociationsCard.tsx  # Main extension component
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

# PharmaTrack

<div align="center">
  <h3><b>Comprehensive Pharmacy Management Solution</b></h3>
</div>

<a name="readme-top"></a>

## 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [🙏 Acknowledgements](#acknowledgements)
- [📝 License](#license)

## 📖 About the Project <a name="about-project"></a>

**PharmaTrack** is a comprehensive pharmacy management solution designed for inventory control, sales tracking, POS operations, and financial reporting. Whether it's managing prescriptions, tracking stock levels, or analyzing sales performance, PharmaTrack empowers pharmacies to operate efficiently and make informed decisions.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://typescriptlang.org/">TypeScript</a></li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://neon.tech/">Neon (PostgreSQL)</a></li>
    <li><a href="https://www.prisma.io/">Prisma ORM</a></li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- **Inventory Management** – Monitor stock levels, set reorder alerts, and manage product batches
- **Sales & POS** – Handle real-time sales and payment processing with POS support
- **Purchase Orders** – Track supplier orders, receiving, and cost management
- **Reports & Analytics** – Gain insights into sales, profits, and inventory turnover
- **Secure Role-Based Access** – Manage users (admin, pharmacist, cashier) with permission controls
- **Prescription Management** – Track and manage patient prescriptions and history

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Live Demo <a name="live-demo"></a>

- [Live Demo Link](https://pharmatrack.example.com) (Coming soon)
- [Walkthrough Video](https://youtube.com/example) (Coming soon)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites <a name="prerequisites"></a>

In order to run this project you need:

- Git version 2.38.x or higher
- Node.js version 18.x or higher
- npm version 9.x or higher
- PostgreSQL DB (via Neon or local)
- IDE (VSCode recommended)
- Modern web browser

### Setup <a name="setup"></a>

Clone this repository to your desired folder:

```sh
cd my-projects
git clone git@github.com:yourusername/pharmatrack.git
```

### Install <a name="install"></a>

Install this project with:

```sh
cd pharmatrack
npm install
```

Set up your environment variables:

```sh
cp .env.example .env
# Edit the .env file with your Neon DB credentials and secret keys
```

### Usage <a name="usage"></a>

To run the development server:

```sh
# In the project root directory
npm run dev
```

To run just the frontend:

```sh
cd client
npm run dev
```

To run just the backend:

```sh
cd server
npm run dev
```

### Run tests <a name="run-tests"></a>

To run tests, execute the following command:

```sh
npm test
```

For linting:

```sh
npm run lint
```

### Deployment <a name="deployment"></a>

You can deploy this project using:

```sh
npm run build
# Deploy the build folder (client) and host server (backend) using platforms like Vercel, Render, or Railway
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👥 Authors <a name="authors"></a>

👤 **Obi Anthony**

- GitHub: [@Megagig](https://github.com/Megagig)
- Twitter: [@Megagigsolution](https://twitter.com/Megagigsolution)
- LinkedIn: [Obi Anthony](https://linkedin.com/in/Obi-Anthony)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔭 Future Features <a name="future-features"></a>

- **Mobile App Support** – Flutter-based mobile app for on-the-go pharmacy management
- **Barcode Scanner Integration** – Fast product lookup and sale processing
- **Accounting Module** – Track expenses, income, profit/loss, and ledger entries
- **SMS/Email Notifications** – Send alerts for refills, restocks, and prescriptions

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/yourusername/pharmatrack/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgements <a name="acknowledgements"></a>

- Thanks to all contributors who help make this project better
- Special thanks to pharmacy owners and staff who provided early feedback

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

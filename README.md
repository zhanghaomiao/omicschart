# OmicsChart

A collection of React components for visualizing omics data using ECharts.

## Components

This repository contains various chart components optimized for biological data visualization:

- **DimPlot**: Dimensional reduction plots (PCA, t-SNE, UMAP)
- **FeaturePlot**: Feature expression visualization
- **GeneExpressionChart**: Gene expression level charts
- **SurvivalChart**: Survival analysis plots
- **TCGAChart**: TCGA data visualization
- **VolcanicMap**: Volcano plots for differential analysis

## Storybook Documentation

The components are documented and demonstrated using Storybook. You can view the live documentation at:

**[View Live Storybook →](https://[your-username].github.io/omicschart/)**

*Replace `[your-username]` with your actual GitHub username*

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/omicschart.git
cd omicschart
```

2. Install dependencies:
```bash
pnpm install
```

3. Start Storybook development server:
```bash
pnpm run storybook
```

The Storybook will be available at `http://localhost:6006`

### Building

To build Storybook for production:

```bash
pnpm run build-storybook
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment happens automatically when you push to the `main` branch.

### Manual Deployment

You can also trigger a manual deployment from the GitHub Actions tab in your repository.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test them
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the ISC License.

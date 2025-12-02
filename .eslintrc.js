module.exports = {
  extends: ['next/core-web-vitals', 'plugin:import/recommended', 'prettier'],

  rules: {
    // --- Accessibility / Next.js overrides ---
    'jsx-a11y/alt-text': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-page-custom-font': 'off',

    // --- Disable hard formatting rules (NO MORE RED UNDERLINES!) ---
    'newline-before-return': 'off',
    'padding-line-between-statements': 'off',
    'import/newline-after-import': 'off',
    'import/order': 'off',

    // Optional: Turn off comments padding rule (if you want)
    'lines-around-comment': 'off'
  },

  settings: {
    react: {
      version: 'detect'
    },

    'import/resolver': {
      node: {},
      typescript: {
        project: './jsconfig.json'
      }
    }
  },

  overrides: []
}

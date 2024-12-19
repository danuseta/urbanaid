import daStyle from 'eslint-config-dicodingacademy';

export default [
  {
    ...daStyle,
    rules: {
      ...daStyle.rules,
      camelcase: 'off',
      'no-underscore-dangle': 'off'
    }
  }
];
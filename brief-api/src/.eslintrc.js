/* eslint-disable quote-props */
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module'
    },
    extends: [
        'standard'
    ],
    rules: {
        'import/no-unresolved': [2],
        'indent': ['error', 4],
        'quotes': 'warn',
        'no-unused-vars': 'warn',
        'keyword-spacing': 'warn',
        'space-before-function-paren': 'warn',
        'eqeqeq': 'warn',
        'space-infix-ops': 'warn',
        'comma-spacing': 'warn',
        'brace-style': 'warn',
        'curly': 'warn',
        'no-multiple-empty-lines': 'warn',
        'operator-linebreak': 'warn',
        'one-var': 'warn',
        'no-cond-assign': 'warn',
        'block-spacing': 'warn',
        'camelcase': 'warn',
        'comma-dangle': 'warn',
        'comma-style': 'warn',
        'dot-location': 'warn',
        'eol-last': 'warn',
        'func-call-spacing': 'warn',
        'key-spacing': 'warn',
        'accessor-pairs': 'warn',
        'no-array-constructor': 'warn',
        'no-fallthrough': 'warn',
        'no-extra-parens': 'warn',
        'no-floating-decimal': 'warn',
        'no-mixed-spaces-and-tabs': 'warn',
        'no-multi-spaces': 'warn',
        'no-tabs': 'warn',
        'no-trailing-spaces': 'warn',
        'padded-blocks': 'warn',
        'semi': ['warn', 'never'],
        'semi-spacing': 'warn',
        'space-before-blocks': 'warn',
        'space-in-parens': 'warn',
        'space-unary-ops': 'warn',
        'spaced-comment': 'warn',
        'template-curly-spacing': 'warn',
        'yoda': 'warn',
        'no-use-before-define': 'off',
        'no-useless-escape': 'warn',
        'no-undef': 'warn'
    },
    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.ts']
            }
        }
    }
}

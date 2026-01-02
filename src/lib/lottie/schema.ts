import type { Schema } from 'ajv'

export const lottieSchema: Schema = {
  type: 'object',
  properties: {
    v: { type: 'string' },
    fr: { type: 'number', minimum: 1, maximum: 120 },
    ip: { type: 'number', minimum: 0 },
    op: { type: 'number', minimum: 1 },
    w: { type: 'number', minimum: 1 },
    h: { type: 'number', minimum: 1 },
    nm: { type: 'string' },
    layers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ty: { type: 'number' },
          nm: { type: 'string' },
          ind: { type: 'number' },
          ip: { type: 'number' },
          op: { type: 'number' },
          ks: {
            type: 'object',
            properties: {
              p: { type: 'object', required: ['a', 'k'] },
              s: { type: 'object', required: ['a', 'k'] },
              r: { type: 'object', required: ['a', 'k'] },
              o: { type: 'object', required: ['a', 'k'] },
              a: { type: 'object', required: ['a', 'k'] },
            },
            required: ['p', 's', 'r', 'o', 'a'],
          },
          shapes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                ty: { type: 'string' },
                nm: { type: 'string' },
              },
              required: ['ty', 'nm'],
            },
          },
        },
        required: ['ty', 'nm', 'ind', 'ip', 'op', 'ks'],
      },
    },
  },
  required: ['v', 'fr', 'ip', 'op', 'w', 'h', 'nm', 'layers'],
}

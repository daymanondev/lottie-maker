import Ajv from 'ajv'
import type { LottieAnimation } from '@/types'
import { lottieSchema } from './schema'

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  path: string
  message: string
  keyword: string
}

const ajv = new Ajv({ allErrors: true, strict: false })
const validateSchema = ajv.compile<LottieAnimation>(lottieSchema)

export function validateLottieJson(animation: LottieAnimation): ValidationResult {
  const valid = validateSchema(animation)

  if (valid) {
    return { valid: true, errors: [] }
  }

  const errors: ValidationError[] = (validateSchema.errors || []).map((err) => ({
    path: err.instancePath || '/',
    message: err.message || 'Unknown validation error',
    keyword: err.keyword,
  }))

  return { valid: false, errors }
}

export function validateAnimationBounds(animation: LottieAnimation): ValidationResult {
  const errors: ValidationError[] = []

  if (animation.op <= animation.ip) {
    errors.push({
      path: '/op',
      message: 'Out-point must be greater than in-point',
      keyword: 'range',
    })
  }

  if (animation.fr < 1 || animation.fr > 120) {
    errors.push({
      path: '/fr',
      message: 'Frame rate must be between 1 and 120',
      keyword: 'range',
    })
  }

  if (animation.w < 1 || animation.h < 1) {
    errors.push({
      path: '/w',
      message: 'Canvas dimensions must be positive',
      keyword: 'range',
    })
  }

  for (let i = 0; i < animation.layers.length; i++) {
    const layer = animation.layers[i]
    if (layer.op > animation.op) {
      errors.push({
        path: `/layers/${i}/op`,
        message: `Layer "${layer.nm}" out-point exceeds animation duration`,
        keyword: 'range',
      })
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateLottie(animation: LottieAnimation): ValidationResult {
  const schemaResult = validateLottieJson(animation)
  if (!schemaResult.valid) {
    return schemaResult
  }

  const boundsResult = validateAnimationBounds(animation)
  return boundsResult
}

export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return ''

  return errors
    .map((err) => `${err.path}: ${err.message}`)
    .join('\n')
}

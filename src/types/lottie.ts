// Lottie types
export interface LottieAnimation {
  v: string
  fr: number
  ip: number
  op: number
  w: number
  h: number
  nm: string
  layers: LottieLayer[]
}

export interface LottieLayer {
  ty: number
  nm: string
  ind: number
  ip: number
  op: number
  ks: LottieTransform
  shapes?: LottieShape[]
}

export interface LottieTransform {
  p: LottieAnimatedValue
  s: LottieAnimatedValue
  r: LottieAnimatedValue
  o: LottieAnimatedValue
  a: LottieAnimatedValue
}

export interface LottieAnimatedValue {
  a: 0 | 1
  k: number | number[] | LottieKeyframe[]
}

export interface LottieKeyframe {
  t: number
  s: number[]
  e?: number[]
  i?: { x: number; y: number }
  o?: { x: number; y: number }
}

export interface LottieShape {
  ty: string
  nm: string
  it?: LottieShape[]
  c?: LottieColorValue
  s?: LottieColorValue
}

export interface LottieColorValue {
  a: 0 | 1
  k: number[] | LottieColorKeyframe[]
}

export interface LottieColorKeyframe {
  t: number
  s: number[]
  i?: { x: number; y: number }
  o?: { x: number; y: number }
}

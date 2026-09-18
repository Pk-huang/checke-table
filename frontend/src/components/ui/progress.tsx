type ProgressProps = {
  value: number
}

export function Progress({ value }: ProgressProps) {
  return <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${value}%` }} /></div>
}

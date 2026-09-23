type ProgressProps = {
  value: number
  className?: string
}

export function Progress({ value, className }: ProgressProps) {
  return <div className={`mt-[37px] h-2 overflow-hidden bg-[#d9d9d9] dark:bg-[#454545] ${className ?? ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span className="block h-full bg-[#1677b7] dark:bg-[#58a9d6]" style={{ width: `${value}%` }} /></div>
}

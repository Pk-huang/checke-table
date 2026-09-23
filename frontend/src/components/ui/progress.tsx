type ProgressProps = {
  value: number
}

export function Progress({ value }: ProgressProps) {
  return <div className="mt-[37px] h-[7px] overflow-hidden bg-[#ddd] dark:bg-[#444]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span className="block h-full bg-[#2c837a] dark:bg-[#ddd]" style={{ width: `${value}%` }} /></div>
}

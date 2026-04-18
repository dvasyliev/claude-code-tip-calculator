export interface FieldInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  type?: 'text' | 'number'
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  min?: string
  max?: string
}

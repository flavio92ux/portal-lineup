'use client'

import { useCallback, useEffect } from 'react'
import { TextInput, FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import './index.scss'

type SlugComponentProps = {
  fieldToUse: string
  checkboxFieldPath: string
} & TextFieldClientProps

const formatSlug = (val: string): string =>
  val
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-/, '') // Remove leading hyphen
    .replace(/-$/, '') // Remove trailing hyphen

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field

  const checkboxValue = useFormFields(([fields]) => {
    const checkbox = fields[checkboxFieldPath]
    // Default to true if checkbox doesn't exist or is true
    return checkbox?.value !== false
  })

  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string
  })

  const { value, setValue } = useField<string>({ path: path || field.name })

  useEffect(() => {
    if (checkboxValue) {
      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue)
        if (value !== formattedSlug) {
          setValue(formattedSlug)
        }
      } else {
        if (value !== '') {
          setValue('')
        }
      }
    }
  }, [targetFieldValue, checkboxValue, setValue, value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(formatSlug(e.target.value))
    },
    [setValue],
  )

  const readOnly = readOnlyFromProps || checkboxValue

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label={label} />
      </div>
      <TextInput
        value={value || ''}
        onChange={handleChange}
        path={path || field.name}
        readOnly={Boolean(readOnly)}
      />
    </div>
  )
}

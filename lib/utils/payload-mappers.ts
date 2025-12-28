/**
 * Payload mapping utilities for API requests
 * Handles transformation from frontend to backend DTO format
 */

import { CreateUserPayload } from '@/lib/api/users'

// Backend DTO interface (camelCase - sesuai NestJS CreateUserDto)
export interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
  password?: string
  role?: 'admin' | 'user'        
  sendInvitation?: boolean         
}

/**
 
 *
 * @param frontendData 
 * @returns 
 */
export function mapCreateUserPayload(frontendData: CreateUserPayload): CreateUserDto {
  console.log('🔄 [PAYLOAD MAPPER] Mapping frontend payload to backend CreateUserDto format')
  console.log('📥 [PAYLOAD MAPPER] Frontend input:', {
    ...frontendData,
    password: frontendData.password ? '[HIDDEN]' : undefined
  })

 
  const backendPayload: CreateUserDto = {
    email: frontendData.email,
    firstName: frontendData.firstName,        
    lastName: frontendData.lastName,          
    role: frontendData.role || 'user',       
    sendInvitation: frontendData.sendInvitation ?? false, 
    ...(frontendData.password && { password: frontendData.password })
  }

  console.log('📤 [PAYLOAD MAPPER] Backend output (CreateUserDto):', {
    ...backendPayload,
    password: backendPayload.password ? '[HIDDEN]' : undefined
  })

  return backendPayload
}

/**
 * Example usage and transformation demonstration
 */
export function demonstratePayloadMapping() {
  // Frontend payload (camelCase)
  const frontendPayload: CreateUserPayload = {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'SecurePass123!',
    role: 'admin',
    sendInvitation: true
  }

  // Backend payload (camelCase - sesuai CreateUserDto)
  const backendPayload = mapCreateUserPayload(frontendPayload)

  console.log('📋 [DEMO] Frontend Payload (camelCase):', {
    ...frontendPayload,
    password: '[HIDDEN]'
  })

  console.log('📋 [DEMO] Backend Payload (camelCase - CreateUserDto):', {
    ...backendPayload,
    password: '[HIDDEN]'
  })

  console.log('🔄 [DEMO] Transformasi:')
  console.log('• firstName → firstName (tetap camelCase)')
  console.log('• lastName → lastName (tetap camelCase)')
  console.log('• role → role (tetap string, bukan array)')
  console.log('• sendInvitation → sendInvitation (tetap camelCase)')
  console.log('• TIDAK ADA snake_case transformation!')
  console.log('• Role tetap sebagai single string, bukan array')

  return {
    frontend: frontendPayload,
    backend: backendPayload
  }
}
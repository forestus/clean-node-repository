import { EmailValidatorAdapter } from './email-validator'
describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@gmail.com')
    expect(isValid).toBe(false)
  })
})

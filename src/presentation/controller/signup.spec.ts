import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'
interface SutTypes{
  sut: SignUpController
  emailValidatorSub: EmailValidator
}
// mock de Validação de Email
const makeSut = (): SutTypes => {
  class EmailValidatorSub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorSub = new EmailValidatorSub()
  const sut = new SignUpController(emailValidatorSub)
  return {
    sut,
    emailValidatorSub
  }
}
describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'forestus7@gmail.com',
        password: 'sugoi777',
        passwordConfirmation: 'sugoi777'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    // to be compara também o ponteiro dos objetos
    // toequal compara os valores apenas
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'forestus7',
        password: 'sugoi777',
        passwordConfirmation: 'sugoi777'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'forestus7',
        email: 'forestus7@gmail.com',
        passwordConfirmation: 'sugoi777'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'forestus7',
        email: 'forestus7@gmail.com',
        password: 'sugoi777'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorSub } = makeSut()
    // alteração do valor do mock
    jest.spyOn(emailValidatorSub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'forestus7',
        email: 'invalid@gmail.com',
        password: 'sugoi777',
        passwordConfirmation: 'sugoi777'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSub } = makeSut()
    // alteração do valor do mock
    const isValidSpy = jest.spyOn(emailValidatorSub, 'isValid')
    const httpRequest = {
      body: {
        name: 'forestus7',
        email: 'forestus7@gmail.com',
        password: 'sugoi777',
        passwordConfirmation: 'sugoi777'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('forestus7@gmail.com')
  })
  test('should return 500 if EmailValidator throws', () => {
    class EmailValidatorSub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorSub = new EmailValidatorSub()
    const sut = new SignUpController(emailValidatorSub)
    const httpRequest = {
      body: {
        name: 'forestus7',
        email: 'forestus7@gmail.com',
        password: 'sugoi777',
        passwordConfirmation: 'sugoi777'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})

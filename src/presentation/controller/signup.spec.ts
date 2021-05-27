import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
interface SutTypes{
  sut: SignUpController
  emailValidatorSub: EmailValidator
}
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSub()
}
// mock de Validação de Email
const makeSut = (): SutTypes => {
  const emailValidatorSub = makeEmailValidator()
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

  test('should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'forestus7',
        email: 'forestus7@gmail.com',
        password: 'sugoi777',
        passwordConfirmation: 'invalid'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
    const { sut, emailValidatorSub } = makeSut()
    jest.spyOn(emailValidatorSub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
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

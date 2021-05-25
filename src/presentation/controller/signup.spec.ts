import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SignUpController()
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

  test('should return 400 if no name is provided', () => {
    const sut = new SignUpController()
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
})

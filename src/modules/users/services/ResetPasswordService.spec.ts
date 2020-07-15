import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import ResetPasswordService from './ResetPasswordService'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPassword: ResetPasswordService

describe('ResetPassword', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    resetPassword = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository)

  })

  it('should be able to reset the password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Johnny Cash',
      email: 'johnnycasher@gloiro.com',
      password: '123456'
    })

    const {token} = await fakeUserTokensRepository.generate(user.id)

    await resetPassword.execute({
      password: '123123',
      token
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(updatedUser?.password).toBe('123123')
  })
})
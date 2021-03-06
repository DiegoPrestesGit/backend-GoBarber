import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async create ({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id })

    this.appointments.push(appointment)

    return appointment
  }

  public async findByDate (date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(app =>
      isEqual(app.date, date) &&
      (app.provider_id === provider_id)
    )

    return findAppointment
  }

  public async findAllInMonthFromProvider ({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const allAppointments = this.appointments.filter(app => {
      return (
        app.provider_id === provider_id &&
        getMonth(app.date) + 1 === month &&
        getYear(app.date) === year
      )
    })

    return allAppointments
  }

  public async findAllInDayFromProvider ({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const allAppointments = this.appointments.filter(app => {
      return (
        app.provider_id === provider_id &&
        getDate(app.date) === day &&
        getMonth(app.date) + 1 === month &&
        getYear(app.date) === year
      )
    })

    return allAppointments
  }
}

export default FakeAppointmentsRepository

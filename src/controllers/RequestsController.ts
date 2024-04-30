import Requests from '../models/Requests'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from "express";
import { getToken } from '../utils/getToken';
import axios from 'axios';

export default class RequestsController {

  static async getRequests(req: Request, res: Response) {

    const token = await getToken()
    const response = await axios.post('https://api.sae1.pure.cloud/api/v2/analytics/users/details/query', {
      "order": "desc",
      "orderBy": "conversationStart",
      "paging": {
        "pageSize": 50,
        "pageNumber": 1
      },
      "segmentFilters": [
        {
          "type": "or",
          "predicates": [
            {
              "dimension": "direction",
              "value": "inbound"
            }
          ]
        }
      ],
      "conversationFilters": [],
      "evaluationFilters": [],
      "surveyFilters": [],
      "interval": "2023-01-01T03:00:00.000Z/2023-01-06T03:00:00.000Z"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Nenhum registro encontrado'
      })
    }

    if (response.data.error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: response.data.error
      })
    }

    for (const userDetail of response.data.userDetails) {
      try {
        let userName = await RequestsController.getUserByUserId(userDetail.userId)

        if (userName.message) {
          userName = null
        }

        userDetail.userName = userName?.name

        const requestExists = await Requests.findOne({ userId: userDetail.userId })

        if (requestExists) {
          await requestExists.updateOne(userDetail)

          return res.status(StatusCodes.OK).json({
            message: 'Requisição atualizada',
          })
        }

        const request = new Requests(userDetail)

        await request.save()
      } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error
        })
      }
    }

    return res.status(StatusCodes.OK).json({
      message: 'Requisição criada',
    })
  }

  static async getUserByUserId(userId: string) {

    try {
      if (!userId) {
        return new Error('Nenhum ID informado')
      }

      const token = await getToken()
      const response = await axios.get(`https://api.sae1.pure.cloud/api/v2/analytics/reporting/dashboards/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.data) {
        return new Error('Nenhum registro encontrado')
      }

      if (response.data.error) {
        return new Error(response.data.error)
      }

      return response.data
    } catch (error) {
      return error
    }

  }

  static async getAllRequests(req: Request, res: Response) {
    const requests = await Requests.find()

    if (!requests) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Nenhum registro encontrado'
      })
    }

    return res.status(StatusCodes.OK).json(requests)
  }

}
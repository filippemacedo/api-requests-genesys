import RequestsController from "../controllers/RequestsController";
import { getToken } from "../utils/getToken";
import axios from "axios";
import Requests from "../models/Requests";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";


export default async function getRequests(req: Request, res: Response) {

  console.log('Cron rodando')

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

        console.log('Requisição atualizada')
        return res.status(StatusCodes.OK).json({
          message: 'Requisição atualizada',
        })
      }

      const request = new Requests(userDetail)

      await request.save()
      console.log('Requisição salva')
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
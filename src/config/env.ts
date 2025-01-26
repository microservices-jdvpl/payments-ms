import { BadRequestException } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface IEnvs {
  PORT: number;
  STRIPE_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_ENDPOINTSECRET: string;
}

const envsSchema = joi
  .object<IEnvs>({
    PORT: joi.number().required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINTSECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new BadRequestException(error.message);
}

const envVars: IEnvs = value;

export const envs = {
  PORT: envVars.PORT,
  STRIPE_SECRET: envVars.STRIPE_SECRET,
  STRIPE_SUCCESS_URL: envVars.STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL: envVars.STRIPE_CANCEL_URL,
  STRIPE_ENDPOINTSECRET: envVars.STRIPE_ENDPOINTSECRET,
};

import { Injectable } from '@nestjs/common';
import { WaterFreeDto } from './dto/waterfree.dto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WaterfreeService {
  private axiosInstance: AxiosInstance;
  constructor() {
    // Configura la instancia de Axios
    this.axiosInstance = axios.create({
      baseURL: 'https://api.premioccn.com.ni/v1/', // URL base para las solicitudes
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
  async generate(data: WaterFreeDto) {
    try {
      const cedulaSanity = data.identity.replace('-', '');
      const number = this.generateRandomNumber();
      const nombreSplit = data.username.split(' ');
      const email = `${nombreSplit[0].toLowerCase()}.${nombreSplit[1].toLowerCase()}@gmail.com`;

      const nombre = nombreSplit[0];
      const apellido = nombreSplit[1];

      // Define the data to send in the axios request
      try {
        await this.axiosInstance.post('forms', {
          campaignName: 'Spark Watermelon',
          form: JSON.stringify([
            {
              question: 'Nombre',
              response: nombre.toUpperCase(),
              required: true,
            },
            {
              question: 'Apellido',
              response: apellido.toUpperCase(),
              required: true,
            },
            {
              question: 'Correo',
              response: email,
              required: true,
            },
            {
              question: 'Cédula',
              response: cedulaSanity,
              required: true,
            },
            {
              question: 'Celular',
              response: number,
              required: true,
            },
            {
              question: 'Departamento',
              response: 'Chinandega',
              required: true,
            },
            {
              question: 'Si acepto los términos y condiciones de la promoción',
              response: 'Si',
              required: true,
            },
            {
              question:
                'Si acepto recibir correos de promoción de parte de CCN',
              response: 'Si',
              required: false,
            },
          ]),
          email: email,
          receiveMail: true,
          cedula: cedulaSanity,
        });
      } catch (error) {
        console.error(error);
      }

      console.log('formulario creado correctamente');

      const response = await this.axiosInstance.post('users/reward-codes', {
        campaignName: 'Spark Watermelon',
        deviceType: 3,
        cedula: cedulaSanity,
        email: email,
      });

      console.log('codigo obtenido correctamente');

      if (response.status === 200) {
        const result = response.data;
        if ('code' in result) {
          return {
            code: result.code ?? '',
            message: '',
          };
        }
      }
      return {
        code: '',
        message: '',
      };
    } catch (error) {
      console.error(error);
      return {
        code: '',
        message: '',
      };
    }
  }

  generateRandomNumber = () => {
    const prefix = '85';
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // Número aleatorio entre 100000 y 999999
    return prefix + randomDigits;
  };
}

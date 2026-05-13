import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useBodyParser('json', { limit: '15mb' })
  app.useBodyParser('urlencoded', { limit: '15mb', extended: true })
  app.enableCors({
    origin: [
      /^http:\/\/localhost(:\d+)?$/,
      /\.vercel\.app$/,
    ],
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()

import * as prompt from "prompt"
import { writeToPath } from '@fast-csv/format';
import * as path from 'path'
import axios, { AxiosResponse } from 'axios';

const main = async (): Promise<any> => {
  prompt.start()
  const vals: {
     npmPackage: string
     startDate: string,
     endDate: string
  } = await prompt.get(['npmPackage', 'startDate', 'endDate'])
  const npmPackage: string = vals.npmPackage
  const startDate: string = vals.startDate 
  const endDate: string = vals.endDate
  const res: AxiosResponse = await axios.get(`https://npm-stat.com/api/download-counts?package=${npmPackage}&from=${startDate}&until=${endDate}`)
  const values: string[] = Object.values(res.data.avalanche)
  const rows: string[][] = []
  Object.keys(res.data.avalanche).forEach((
    key: string, 
    index: number
  ): void => {
    rows.push([key, values[index]])
  })
  writeToPath(path.resolve(__dirname, 'stats.csv'), rows)
    .on('error', err => console.error(err))
    .on('finish', () => console.log('stats.csv created'))
}
  
main()

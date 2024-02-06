import { getUserInfo, getAverageSteps } from '../src/user-info';
import { users} from '../src/data/users'; 

const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageSteps = document.querySelector('h3')

const randomUser = getUserInfo(Math.floor(Math.random() * users.length))


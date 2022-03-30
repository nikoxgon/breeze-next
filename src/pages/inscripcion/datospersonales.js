import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import AuthValidationErrors from '@/components/AuthValidationErrors'
import Button from '@/components/Button'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const Inscripcion = () => {
    const router = useRouter()

    const { inscripcion } = useAuth({
        middleware: 'guest',
        // redirectIfAuthenticated: '/dashboard',
    })

    const [countries, setCountries] = useState([])
    // CREAR STATE PARA LOS INPUTS
    const [name, setName] = useState('')
    const [rut, setRut] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('')
    const [pase_movilidad, setPmovilidad] = useState(false)
    const [grupo_riesgo, setGriesgo] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        setEmail(localStorage.getItem('email'))
        loadCountryData()
        if (router.query.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    }, [])

    const loadCountryData = async () => {
        const response = await axios.get(
            'http://localhost:8000/api/v1/countries',
        )
        if (response.status === 200) {
            setCountries(response.data)
        }

        if (response.status === 500) {
            // console.log('Error al cargar los paises')
        }
    }

    const submitForm = async event => {
        event.preventDefault()
        localStorage.setItem('country', country)
        inscripcion({
            name,
            rut,
            email,
            phone,
            pase_movilidad,
            grupo_riesgo,
            country,
            setErrors,
            setStatus,
        })
    }

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <a>
                            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                        </a>
                    </Link>
                }>
                {/* Session Status */}
                <AuthSessionStatus className="mb-4" status={status} />

                {/* Validation Errors */}
                <AuthValidationErrors className="mb-4" errors={errors} />

                <form onSubmit={submitForm}>
                    {/* Nombre completo */}
                    <div>
                        <Label htmlFor="name">Nombre</Label>

                        <Input
                            id="name"
                            type="text"
                            value={name}
                            className="block mt-1 w-full"
                            onChange={event => setName(event.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    {/* RUT */}
                    <div className="mt-4">
                        <Label htmlFor="rut">RUT</Label>

                        <Input
                            id="rut"
                            type="text"
                            value={rut}
                            className="block mt-1 w-full"
                            onChange={event => setRut(event.target.value)}
                            required
                        />
                    </div>

                    {/* MAIL */}
                    <div className="mt-4">
                        <Label htmlFor="email">Mail</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled={true}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    {/* PAÍS */}
                    <div className="mt-4">
                        <Label htmlFor="country">País</Label>

                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="country"
                            required
                            disabled={countries.length > 0 ? false : true}
                            onChange={e => setCountry(e.target.value)}>
                            <option value="">
                                {countries.length > 0
                                    ? 'Seleccione un país'
                                    : 'Cargando...'}
                            </option>
                            {countries.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Celular */}
                    <div className="mt-4">
                        <Label htmlFor="phone">Numero Telefónico</Label>

                        <Input
                            id="phone"
                            type="tel"
                            pattern="[0-9.]+"
                            value={phone}
                            className="block mt-1 w-full"
                            onChange={event => setPhone(event.target.value)}
                            required
                        />
                    </div>
                    {/* Pase de movilidad */}
                    <div className="block mt-4">
                        <label
                            htmlFor="pase_movilidad"
                            className="inline-flex items-center">
                            <input
                                id="pase_movilidad"
                                name="pase_movilidad"
                                type="checkbox"
                                value={pase_movilidad}
                                onChange={event =>
                                    setPmovilidad(Boolean(event.target.value))
                                }
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />

                            <span className="ml-2 text-sm text-gray-600">
                                Pase de movilidad
                            </span>
                        </label>
                    </div>
                    {/* Grupo de riesgo */}
                    <div className="block mt-4">
                        <label
                            htmlFor="grupo_riesgo"
                            className="inline-flex items-center">
                            <input
                                id="grupo_riesgo"
                                name="grupo_riesgo"
                                type="checkbox"
                                value={grupo_riesgo}
                                onChange={event =>
                                    setGriesgo(Boolean(event.target.value))
                                }
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />

                            <span className="ml-2 text-sm text-gray-600">
                                Grupo de riesgo
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Button className="ml-3">Continuar</Button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default Inscripcion
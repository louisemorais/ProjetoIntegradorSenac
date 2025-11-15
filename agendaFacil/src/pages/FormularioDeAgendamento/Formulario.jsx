import { useState } from 'react'
import dayjs from 'dayjs'
import Calendario from '../../components/calendar/Calendario'
import InputField from '../../components/inputField/InputField'
import Selector from '../../components/selector/Selector'
import './Formulario.css'

export default function Formulario() {
    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [observacao, setObservacao] = useState('')
    const [horario, setHorario] = useState('')
    const [data, setdata] = useState(dayjs())

    const handleSubmit = (e) => {
        e.preventDefault()

        const dataSelecionada = {
            dia: data.$D,
            mes: data.$M + 1,
            ano: data.$y
        }
        const informacaoesFormulario = {
            nome,
            telefone,
            email,
            observacao,
            horario,
            dataSelecionada,
        }

        console.log(informacaoesFormulario)
    }

    return (
        <div className='formulario-background'>
            <form onSubmit={handleSubmit} className='formulario-form'>

                <div className='inputFields-background'>
                    <InputField
                        label='Nome'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder='Insira aqui o seu nome'
                    />

                    <InputField
                        label='Telefone'
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder='Insira aqui o seu telefone'
                    />

                    <InputField
                        label='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Insira aqui o seu e-mail'
                    />

                    <InputField
                        label='Observação'
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder='Insira aqui a sua observação'
                    />
                </div>


                <div className='agendamento-linha'>
                    <div className='calendario-background'>
                        <Calendario
                            data={data}
                            setData={setdata}
                        />
                    </div>

                    <div className='selector-background'>
                        <Selector
                            selectorText='Horários'
                            value={horario}
                            onChange={setHorario}
                            options={[
                                { label: '09:00', value: '09:00' },
                                { label: '08:00', value: '08:00' },
                                { label: '10:00', value: '10:00' },
                            ]}
                        />
                    </div>

                </div>

                <button type='submit' className='botao-enviar'>Enviar</button>

            </form>
        </div>
    )
}
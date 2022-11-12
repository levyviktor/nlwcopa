import Image from "next/image";
import AppPreviewImg from "../assets/app-nlw-copa-preview.png";
import LogoImg from "../assets/logo.svg";
import UserAvatarExampleImg from "../assets/users-avatar-example.png";
import IconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  


  async function createPool(event: FormEvent ) {
    event.preventDefault()

    try {
   const reponse = await api.post('/pools', {
     title: poolTitle,
     
   })
      const { code } = reponse.data

      await navigator.clipboard.writeText(code)

      alert('Bolao criado com sucesso, o código foi copiado para a area de transferencia!')

      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('Falha ao cria o bolao, tente novamente!')
    }


  }


  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={LogoImg} alt="Logo" />
        <h1 className="text-5xl font-bold leading-tight text-white mt-14">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="flex items-center gap-2 mt-10">
          <Image src={UserAvatarExampleImg} alt="" />
          <strong className="text-xl text-gray-100">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="flex mt-10 gap-2 ">
          <input
            className="flex-1 px-6 py-4 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            CRIAR MEU BOLÃO
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed ">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={IconCheckImg} alt="" />
            <div className="flex flex-col ">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={IconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={AppPreviewImg} alt="Dois celulares" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [
    poolCountReponse,
    guessCountResponse,
    usersCountResponse]
    = await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountReponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };

}

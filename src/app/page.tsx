import CarProblemForm from "@/components/CarProblemForm"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <div className="w-full">
        <h1 className="text-center text-2xl font-bold mb-4">Заявка на ремонт</h1>
        <CarProblemForm />
      </div>
    </main>
  )
} 
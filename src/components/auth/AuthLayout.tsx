export const AuthLogo = () => (
  <h2
    className="w-full text-yellow-400  font-bold text-3xl sm:text-4xl"
    style={{ textShadow: '2px 2px 0px #6a2c05' }}
  >
    {' '}
    Next.js
    <span className="text-orange-500"> Native </span> 🏄
  </h2>
)

export const AuthLayout = ({ children }: any) => (
  <>
    <div className="w-full relative flex justify-center min-h-full md:px-12 lg:px-0">
      <div className="w-full relative z-10 flex flex-col justify-center flex-1 px-4 py-12 bg-transparent md:flex-none md:px-28">
        <div className="w-full max-w-md mx-auto sm:px-4  md:max-w-lg md:px-0">
          {children}
        </div>
      </div>
    </div>
  </>
)

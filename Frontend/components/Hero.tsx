"use client"
export const Hero =() => {
    const handleSignIn = () => {
            window.location.href ='http://localhost:8080/auth/google';
         }
    return ( 
        
        <div className="h-[850px] bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm: py-24 relative overflow-clip"> 
          
          <div className="absolute inset-0 z-0">

           <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[1200px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
           </div>
           
           <div className="conatainer relative mt-10">
          
            <div className="flex items-center justify-center">
            <p className="inline-flex gap-3 border py-1 px-2 rounded-lg bg-white/30">
                <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text]">This is a beta version</span>
            </p>
            </div>
            <div className="flex justify-center">
            <h1  className="text-7xl sm:text-8xl font-bold tracking-tighter text-center mt-8 inline-flex">Level-Up your Problem-Solving <br/>Tailored to your Skill</h1></div>
            <div className="flex justify-center">
            <p className="text-center text-xl mt-8 max-w-4xl"> We’re building the ultimate platform that blends the depth of DSA with the precision of CP ratings, guiding you to the right questions at the right time. </p>
           </div>   
         <div className="flex justify-center mt-8">
             <button className="bg-white text-black py-3 px-5 rounded-lg font-medium cursor-pointer" onClick={handleSignIn}> Get Started </button>
            </div>
           </div> 
          
        
        </div>
    )
}
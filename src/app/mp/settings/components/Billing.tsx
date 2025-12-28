// "use client";
// // ----------------------
// // Imports
// // ----------------------
// // import {PieChart} from "@mui/x-charts/PieChart";
// import stateStore from "@/store/zuStore";
// // ----------------------
// // Billing Component starts here
// // ----------------------
// const Billing = () => {
//   const {user} = stateStore();
//   return (
//     <>
//       <div className="billing grid items-center">
//         <div className="text-dark-custom-dark-blue dark:text-light-light-white text-lg mx-5">
//           <span className="">Verified:</span>
//           <span className="text-lg mx-4 text-dark-logo-primary">
//             {user?.isVerified ? "Verified" : "You are not verified"}
//           </span>
//           <br />
//           <span className="">Your plan is:</span>
//           <span className="text-lg mx-4 text-dark-logo-primary">{user?.plan}</span>
//         </div>
//         <div className="pie my-10 grid justify-center text-dark-primary-text">
//           {/* <PieChart
//       series={[
//         {
//           data: [
//             { id: 0, value: 10, label: 'series A' },
//             { id: 1, value: 15, label: 'series B' },
//             { id: 2, value: 20, label: 'series C' },
//           ],
//         },
//     ]}
//     width={400}
//     height={200}
//     /> */}
//         </div>
//       </div>
//     </>
//   );
// };
// export default Billing;

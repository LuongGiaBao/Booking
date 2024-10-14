// import React from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { getInvoices, deleteInvoice } from "../../api/invoices";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const Invoices = () => {
//   const queryClient = useQueryClient();

//   const {
//     data: invoices,
//     isLoading,
//     isError,
//   } = useQuery("invoices", getInvoices);

//   const mutation = useMutation((id) => deleteInvoice(id), {
//     onSuccess: () => {
//       queryClient.invalidateQueries("invoices");
//       toast.success("Hóa đơn đã được xóa thành công!");
//     },
//     onError: () => {
//       toast.error("Đã xảy ra lỗi khi xóa hóa đơn.");
//     },
//   });

//   const handleDelete = (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này không?")) {
//       mutation.mutate(id);
//     }
//   };

//   if (isLoading) return <p>Đang tải...</p>;
//   if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Quản lý Hóa đơn</h1>
//       <Link
//         to="/invoices/new"
//         className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded"
//       >
//         Thêm Hóa đơn Mới
//       </Link>
//       <table className="min-w-full bg-white shadow-md rounded">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">Mã Hóa đơn</th>
//             <th className="py-2 px-4 border-b">Tên Khách hàng</th>
//             <th className="py-2 px-4 border-b">Ngày mua</th>
//             <th className="py-2 px-4 border-b">Số tiền</th>
//             <th className="py-2 px-4 border-b">Trạng thái</th>
//             <th className="py-2 px-4 border-b">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoices && invoices.length > 0 ? (
//             invoices.map((invoice) => (
//               <tr key={invoice.id} className="text-center">
//                 <td className="py-2 px-4 border-b">{invoice.invoiceNumber}</td>
//                 <td className="py-2 px-4 border-b">{invoice.customerName}</td>
//                 <td className="py-2 px-4 border-b">
//                   {new Date(invoice.purchaseDate).toLocaleDateString()}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {invoice.amount.toLocaleString()} VNĐ
//                 </td>
//                 <td className="py-2 px-4 border-b">{invoice.paymentStatus}</td>
//                 <td className="py-2 px-4 border-b space-x-2">
//                   <Link
//                     to={`/invoices/${invoice.id}`}
//                     className="text-blue-500"
//                   >
//                     Xem
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(invoice.id)}
//                     className="text-red-500"
//                   >
//                     Xóa
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="py-2 px-4 border-b text-center">
//                 Không có hóa đơn nào.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Invoices;

import { useState, useEffect } from 'react';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reader/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('获取预约记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm('确定要取消这个预约吗？')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reader/cancel-reservation/${reservationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setReservations(reservations.filter(r => r.id !== reservationId));
      }
    } catch (error) {
      console.error('取消预约失败:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的预约</h1>
      
      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无预约记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{reservation.bookTitle || '未知书籍'}</h3>
                  <p className="text-sm text-gray-500 mt-1">作者: {reservation.bookAuthor}</p>
                  <p className="text-sm text-gray-500">
                    预约时间: {new Date(reservation.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    状态: {reservation.status === 'PENDING' ? '待处理' : 
                           reservation.status === 'EXPIRED' ? '已过期' : '已取消'}
                  </p>
                </div>
                {reservation.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(reservation.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    取消预约
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;

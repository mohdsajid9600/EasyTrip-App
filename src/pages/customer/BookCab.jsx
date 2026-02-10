import { useState, useEffect } from 'react';
import { bookCab, getAvailableCabs } from '../../api/customerService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookCab = () => {
    const [booking, setBooking] = useState({
        pickup: '',
        destination: '',
        tripDistanceInKm: ''
    });
    const [cabs, setCabs] = useState([]); // Assuming we might select a cab or generic booking
    // User Requirement: View available cabs.
    // If flow is: Select Cab -> Book, or Input Locations -> Book (auto assign).
    // Reviewing API: POST /booking/customer/booked.
    // Usually implies sending pickup/drop.
    // GET /cab/available likely listing them.
    // I will implement a flow: 
    // 1. Enter Booking Details
    // 2. Submit -> Backend assigns or creates booking.

    // Actually, maybe show available cabs and let user "Book" one?
    // I'll stick to a form for Booking request.

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await bookCab(booking);
            toast.success('Cab booked successfully!');
            navigate('/customer/bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-6">Book a Cab</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Pickup Location"
                        required
                        value={booking.pickup}
                        onChange={(e) => setBooking({ ...booking, pickup: e.target.value })}
                    />
                    <Input
                        label="Drop Location"
                        required
                        value={booking.destination}
                        onChange={(e) => setBooking({ ...booking, destination: e.target.value })}
                    />
                    <Input
                        label="TripDistanceInKm"
                        required
                        value={booking.tripDistanceInKm}
                        onChange={(e) => setBooking({ ...booking, tripDistanceInKm: e.target.value })}
                    />
                    <Button type="submit" disabled={loading} className="w-full text-lg py-3">
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default BookCab;

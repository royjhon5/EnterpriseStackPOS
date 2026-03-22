import Container from '@/components/global/container';
import Image from 'next/image';

export default function AboutUsComponent() {
    return (
        <Container>
            <section className="pt-40 pb-40">
                <div className="flex items-center text-center">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#6C2D40] mt-2">About Us</h1>
                        </div>
                        <p className="text-gray-700 text-lg">
                            Built in 2005, Maxandrea Hotel was born out of a vision to offer elegant, accessible comfort right in the heart of Cagayan de Oro. Conceived to be more than just a place to
                            stay, Maxandrea blends renaissance-marble and hardwood accents with modern amenities a lobby that welcomes you like a warm embrace, and rooms that feel both refined and
                            relaxed.
                        </p>
                        <p className="text-gray-700 text-lg">
                            From day one, it has been positioned at a strategic crossroads located at the corner of J.R. Borja and Aguinaldo Streets, Maxandrea places you just minutes away from the
                            airport, the port, city terminals, malls, government offices, and the vibrant pulse of the business district.
                        </p>
                        <p className="text-gray-700 text-lg">
                            Over time, Maxandrea has earned its place among CDO’s trusted four-star hotels certified by the Cagayan de Oro Hotel & Restaurant Association for meeting high service and
                            facility standards, housing 47 well-appointed rooms including deluxe suites, and grounded in the promise of genuine Kagay-anon hospitality.
                        </p>
                        <div></div>
                    </div>
                </div>
            </section>
        </Container>
    );
}

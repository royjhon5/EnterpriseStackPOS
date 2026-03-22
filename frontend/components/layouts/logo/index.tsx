import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {
    return (
        <Link href="/">
            <Image priority src="/assets/Logo-Maxandrea.jpg" alt="logo" width={160} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} className="rounded-full" />
        </Link>
    );
};

export default Logo;

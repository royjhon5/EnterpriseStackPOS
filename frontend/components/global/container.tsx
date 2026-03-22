'use client';

import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    duration?: number;
    staggerChildren?: boolean;
    scale?: boolean;
}

const Container = ({ children, className, delay = 0.1, reverse = false, duration = 0.6, staggerChildren = false, scale = false }: Props) => {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: reverse ? -40 : 40,
            scale: scale ? 0.95 : 1,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay,
                duration,
                ease: [0.25, 0.1, 0.25, 1],
                type: 'spring',
                stiffness: 100,
                damping: 15,
                when: staggerChildren ? 'beforeChildren' : 'afterChildren',
                staggerChildren: staggerChildren ? 0.1 : 0,
            },
        },
    };

    return (
        <motion.div className={cn('w-full h-full', className)} variants={variants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            {children}
        </motion.div>
    );
};

export default Container;

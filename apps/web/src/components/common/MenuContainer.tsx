import { motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

interface MenuContainerProps extends PropsWithChildren {
  title?: string;
}

export const MenuContainer: FC<MenuContainerProps> = ({
  title,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-sm p-6 bg-primary-default rounded-lg shadow w-full mt-10">

      {
        children
      }
    </motion.div>
  )
}

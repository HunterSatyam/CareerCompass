import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2, Calendar } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
            <Table>
                <TableCaption className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">A list of your registered partner entities</TableCaption>
                <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/50">
                    <TableRow className="border-b border-gray-100 dark:border-zinc-800">
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 py-6 pl-8">Logo</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Company Name</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Registered On</TableHead>
                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 pr-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                <TableCell className="pl-8">
                                    <Avatar className="h-12 w-12 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-800 p-1.5 transition-transform hover:scale-105">
                                        <AvatarImage src={company.logo} className="object-contain" />
                                        <AvatarFallback className="rounded-xl bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-xl">
                                            {company?.name?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-5">
                                    <div className='flex flex-col'>
                                        <span className="font-black text-sm text-gray-900 dark:text-zinc-100">{company.name}</span>
                                        <span className='text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1'>Internal ID: {company._id.slice(-6)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500'>
                                        <Calendar size={12} />
                                        {company.createdAt.split("T")[0]}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Popover>
                                        <PopoverTrigger className="p-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-600">
                                            <MoreHorizontal size={18} className="text-gray-400 dark:text-zinc-500" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-2 rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800" align="end">
                                            <button
                                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                className='flex items-center gap-3 w-full p-3.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all group'
                                            >
                                                <Edit2 className='w-4 h-4 group-hover:text-blue-600 transition-colors' />
                                                <span className='group-hover:text-gray-900 dark:group-hover:text-white'>Edit Identity</span>
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            {filterCompany.length === 0 && (
                <div className="py-32 text-center bg-gray-50/30 dark:bg-zinc-800/10">
                    <div className='inline-flex p-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-700 mb-4 border border-gray-100 dark:border-zinc-700'>
                        <Building2 size={32} />
                    </div>
                    <h3 className='text-gray-900 dark:text-white font-black uppercase tracking-widest text-sm mb-1'>No Companies Matching</h3>
                    <p className="text-xs font-bold text-gray-400 dark:text-zinc-600">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    )
}

export default CompaniesTable

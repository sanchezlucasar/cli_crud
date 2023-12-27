// actions.ts
'use server'
import { NextResponse } from "next/server";
import prisma from '../../libs/prisma';
interface Client {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
}
export const createClients = async (data: any) => {
    try {
        if (!data) {
            return { message: "falta la data" };
        }
        const body = data;
        const { nombre, apellido, dni } = body;

        const userFound = await prisma.cliente.findUnique({
            where: {
                dni: dni,
            },
        });

        if (userFound) {
            return { error: "User already exists" };
        }

        const client = await prisma.cliente.create({
            data: {
                nombre,
                apellido,
                dni,
            },
        });

        return client;
    } catch (error) {
        console.log(error);
        return { error: "Error creating client" };
    }
};

export const fetchClients = async () => {
    try {
        const clients: any[] = await prisma.cliente.findMany();
        console.log('aca', clients);
        return clients;

    } catch (error) {
        return NextResponse.json({ error: "Error fetching clients" }, { status: 500 });
    }
};

export const updateClients = async (data: any) => {
    try {

        const userFound = await prisma.cliente.findUnique({
            where: {
                id: data.id,
            },
        });
        if (!userFound) {
            return NextResponse.json({ message: "El cliente no existe" }, { status: 400 });
        }

        const body = await data;
        const { nombre, apellido, dni } = body;

        const client = await prisma.cliente.update({
            where: {
                id: data.id,
            },
            data: {
                nombre: nombre,
                apellido: apellido,
                dni: dni,
            },
        });
        return NextResponse.json(client, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating client" }, { status: 500 });
    }
};



export const deleteClient = async (id: number) => {
    try {

        const userFound = await prisma.cliente.findUnique({
            where: {
                id: id,
            },
        });
        if (!userFound) {
            return NextResponse.json({ message: "El cliente no existe" }, { status: 400 });
        }

        const client = await prisma.cliente.delete({
            where: {
                id: id,
            }
        });
        return NextResponse.json({ message: 'Cliente Eliminado con éxito' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error delete client" }, { status: 500 });
    }
};

// actions.ts

'use server';

import { NextResponse } from "next/server";
import prisma from '../../libs/prisma';

export const createClients = async (data: any) => {

    try {
        if (!data) {
            return { message: "No se encuentra la informacion para dar de alta al cliente" };
        }
        const { nombre, apellido, dni } = data;

        const userFound = await prisma.cliente.findUnique({
            where: {
                dni: dni,
            },
        });

        if (userFound) {
            return 'existe';
        }
        else {

            const client = await prisma.cliente.create({
                data: {
                    nombre,
                    apellido,
                    dni,
                },
            });

            return NextResponse.json(client);
        }
    } catch (error) {
        console.log(error);
        return { error: "Error creando al cliente" };
    }
};

export const fetchClients = async () => {
    try {
        const clients: any[] = await prisma.cliente.findMany();

        return clients;

    } catch (error) {
        return NextResponse.json({ error: "Error obteniendo los clientes" }, { status: 500 });
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

        const { nombre, apellido, dni } = data;

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
        return client;
    } catch (error) {
        return NextResponse.json({ message: "Error modificando al cliente" }, { status: 500 });
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
        return client;
    } catch (error) {
        return NextResponse.json({ message: "Error eliminando el cliente" }, { status: 500 });
    }
};
